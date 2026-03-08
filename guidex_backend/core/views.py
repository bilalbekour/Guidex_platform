from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User
from .models import (
    Campaign, Department, Procedure, ProcedureVersion, Node, Edge, 
    ProcedureSession, SessionStep, Role, UserProfile
)
from .serializers import (
    CampaignSerializer, DepartmentSerializer, ProcedureSerializer, 
    ProcedureVersionSerializer, NodeSerializer, EdgeSerializer, 
    ProcedureSessionSerializer, SessionStepSerializer, UserSerializer,
    RoleSerializer, UserProfileSerializer
)
import json

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class ProcedureViewSet(viewsets.ModelViewSet):
    queryset = Procedure.objects.all()
    serializer_class = ProcedureSerializer

class ProcedureVersionViewSet(viewsets.ModelViewSet):
    queryset = ProcedureVersion.objects.all()
    serializer_class = ProcedureVersionSerializer

    @action(detail=False, methods=['post'])
    def save_flow(self, request):
        """
        Custom endpoint to save the React Flow JSON into a new ProcedureVersion,
        and automatically parse it into Nodes and Edges.
        Request body expects:
        {
            "procedure_id": 1,
            "raw_json": { "nodes": [...], "edges": [...] }
        }
        """
        procedure_id = request.data.get('procedure_id')
        procedure_name = request.data.get('procedure_name')
        raw_json = request.data.get('raw_diagram_json')
        
        try:
            if procedure_id:
                procedure = Procedure.objects.get(id=procedure_id)
                if procedure_name:
                    procedure.name = procedure_name
                    procedure.save()
            else:
                # Get or create default for demo purposes
                campaign, _ = Campaign.objects.get_or_create(name="Default Campaign")
                department, _ = Department.objects.get_or_create(name="Default Department", campaign=campaign)
                procedure, _ = Procedure.objects.get_or_create(
                    name=procedure_name if procedure_name else "Nuevo Procedimiento", 
                    department=department
                )
        except Procedure.DoesNotExist:
            return Response({'error': 'Procedure not found'}, status=status.HTTP_404_NOT_FOUND)
        
        last_version = ProcedureVersion.objects.filter(procedure=procedure).order_by('-version_number').first()
        new_version_num = (last_version.version_number + 1) if last_version else 1
        
        # Create new version
        new_version = ProcedureVersion.objects.create(
            procedure=procedure,
            version_number=new_version_num,
            raw_diagram_json=raw_json,
            is_published=True
        )

        # Parse nodes
        frontend_node_map = {} # Maps frontend_id to DB Node object
        
        nodes_data = raw_json.get('nodes', [])
        for nd in nodes_data:
            frontend_id = nd.get('id')
            node_type_str = nd.get('type', 'default')
            label = nd.get('data', {}).get('label', 'Untitled')
            
            # Map React Flow types to our DB types
            db_type = 'QUESTION'
            if node_type_str == 'instructionNode': db_type = 'INSTRUCTION'
            elif node_type_str == 'inputNode': db_type = 'INPUT'
            elif node_type_str == 'actionNode': db_type = 'ACTION'

            node = Node.objects.create(
                procedure_version=new_version,
                frontend_id=frontend_id,
                node_type=db_type,
                title=label,
                content=nd.get('data', {}).get('clarification', ''),
                # image=nd.get('data', {}).get('image_file', None) # We will handle uploads separately if needed
            )
            frontend_node_map[frontend_id] = node

        # Parse edges
        edges_data = raw_json.get('edges', [])
        
        # To determine start nodes, find nodes with no incoming edges
        target_node_ids = set([ed.get('target') for ed in edges_data])
        for f_id, node in frontend_node_map.items():
            if f_id not in target_node_ids:
                node.is_start_node = True
                node.save()

        for ed in edges_data:
            source_f_id = ed.get('source')
            target_f_id = ed.get('target')
            
            source_node = frontend_node_map.get(source_f_id)
            target_node = frontend_node_map.get(target_f_id)
            
            if source_node and target_node:
                Edge.objects.create(
                    procedure_version=new_version,
                    source_node=source_node,
                    target_node=target_node,
                    label=ed.get('label', '')
                )
        
        return Response(ProcedureVersionSerializer(new_version).data, status=status.HTTP_201_CREATED)

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer

class EdgeViewSet(viewsets.ModelViewSet):
    queryset = Edge.objects.all()
    serializer_class = EdgeSerializer

class ProcedureSessionViewSet(viewsets.ModelViewSet):
    queryset = ProcedureSession.objects.all()
    serializer_class = ProcedureSessionSerializer

    @action(detail=True, methods=['post'])
    def next_step(self, request, pk=None):
        """
        Advances the agent's session based on the selected edge/answer.
        Body:
        {
            "current_node_id": "node_db_id",
            "selected_edge_id": "edge_db_id",
            "captured_value": "Optional text"
        }
        """
        session = self.get_object()
        
        if session.status != 'IN_PROGRESS':
            return Response({'error': 'Session is not in progress'}, status=status.HTTP_400_BAD_REQUEST)

        current_node_id = request.data.get('current_node_id')
        selected_edge_id = request.data.get('selected_edge_id')
        captured_value = request.data.get('captured_value')

        try:
            current_node = Node.objects.get(id=current_node_id)
        except Node.DoesNotExist:
            return Response({'error': 'Current node not found'}, status=status.HTTP_404_NOT_FOUND)

        # Close current step
        last_step = session.steps.filter(node=current_node, exited_at__isnull=True).last()
        if last_step:
            last_step.exited_at = timezone.now()
            
            if selected_edge_id:
                try:
                    selected_edge = Edge.objects.get(id=selected_edge_id)
                    last_step.selected_edge = selected_edge
                except Edge.DoesNotExist:
                    pass
            
            if captured_value:
                last_step.captured_input = captured_value
                # Save into session variables
                session.captured_variables[current_node.frontend_id] = captured_value
                session.save()
                
            last_step.save()

        # Determine next node
        next_node = None
        if selected_edge_id:
            edge = Edge.objects.get(id=selected_edge_id)
            next_node = edge.target_node
        
        if next_node:
            # Create new step
            SessionStep.objects.create(
                session=session,
                node=next_node
            )
            return Response({
                'session_id': session.id,
                'status': session.status,
                'next_node': NodeSerializer(next_node).data
            })
        else:
            # End of flow
            session.status = 'COMPLETED'
            session.end_time = timezone.now()
            session.save()
            return Response({
                'session_id': session.id,
                'status': session.status,
                'message': 'Flow completed successfully'
            })
