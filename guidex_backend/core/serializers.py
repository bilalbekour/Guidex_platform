from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Campaign, Department, Procedure, ProcedureVersion, Node, Edge, 
    ProcedureSession, SessionStep, Role, UserProfile
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    class Meta:
        model = UserProfile
        fields = '__all__'

class EdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edge
        fields = '__all__'

class NodeSerializer(serializers.ModelSerializer):
    outgoing_edges = EdgeSerializer(many=True, read_only=True)
    class Meta:
        model = Node
        fields = [
            'id', 'frontend_id', 'node_type', 'title', 'content', 
            'image', 'is_start_node', 'outgoing_edges', 'procedure_version'
        ]

class ProcedureVersionSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)
    class Meta:
        model = ProcedureVersion
        fields = '__all__'

class ProcedureSerializer(serializers.ModelSerializer):
    versions = ProcedureVersionSerializer(many=True, read_only=True)
    class Meta:
        model = Procedure
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    procedures = ProcedureSerializer(many=True, read_only=True)
    class Meta:
        model = Department
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    class Meta:
        model = Campaign
        fields = '__all__'

class SessionStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionStep
        fields = '__all__'

class ProcedureSessionSerializer(serializers.ModelSerializer):
    steps = SessionStepSerializer(many=True, read_only=True)
    class Meta:
        model = ProcedureSession
        fields = '__all__'
