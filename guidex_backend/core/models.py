from django.db import models
from django.contrib.auth.models import User, Group

# --- 1. BASE HIERARCHY ---

class Campaign(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    campaign = models.ForeignKey(Campaign, related_name='departments', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.campaign.name} - {self.name}"

class Procedure(models.Model):
    department = models.ForeignKey(Department, related_name='procedures', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.department.name} - {self.name}"

# --- 2. VERSION CONTROL AND VISUAL MODULE ---

class ProcedureVersion(models.Model):
    procedure = models.ForeignKey(Procedure, related_name='versions', on_delete=models.CASCADE)
    version_number = models.PositiveIntegerField()
    # Save the raw JSON from Frontend (React Flow)
    raw_diagram_json = models.JSONField(default=dict, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.procedure.name} v{self.version_number}"

# --- 3. RECURSIVE DECISION TREE ---

class Node(models.Model):
    NODE_TYPES = (
        ('QUESTION', 'Pregunta (Múltiples opciones)'),
        ('INSTRUCTION', 'Instrucción (Sólo continuar)'),
        ('INPUT', 'Solicitud de variable (Ej: Ingrese monto)'),
        ('ACTION', 'Acción Automatizada (API/Webhook)'),
    )
    procedure_version = models.ForeignKey(ProcedureVersion, related_name='nodes', on_delete=models.CASCADE)
    # Visual ID generated in React (e.g. 'node_123')
    frontend_id = models.CharField(max_length=100)
    node_type = models.CharField(max_length=20, choices=NODE_TYPES, default='QUESTION')
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='node_images/', blank=True, null=True)
    is_start_node = models.BooleanField(default=False)
    
    # Extra configs for ACTION nodes
    action_config = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Node {self.frontend_id} - {self.title}"

class Edge(models.Model):
    procedure_version = models.ForeignKey(ProcedureVersion, related_name='edges', on_delete=models.CASCADE)
    source_node = models.ForeignKey(Node, related_name='outgoing_edges', on_delete=models.CASCADE)
    target_node = models.ForeignKey(Node, related_name='incoming_edges', on_delete=models.CASCADE)
    
    # Visual label or response label (e.g. "Yes", "No", "Transfer")
    label = models.CharField(max_length=255, blank=True)
    
    # Dynamic variables
    operator = models.CharField(max_length=20, blank=True, null=True) # e.g., 'GREATER_THAN', 'EQUALS', 'DEFAULT'
    expected_value = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.source_node.frontend_id} -> {self.target_node.frontend_id} ({self.label})"

# --- 4. AUDITS AND ANALYTICS ---

class ProcedureSession(models.Model):
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    procedure_version = models.ForeignKey(ProcedureVersion, on_delete=models.RESTRICT)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='IN_PROGRESS', choices=[
        ('IN_PROGRESS', 'En progreso'),
        ('COMPLETED', 'Completado'),
        ('ABANDONED', 'Abandonado')
    ])
    
    captured_variables = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Session {self.id} - {self.status}"

class SessionStep(models.Model):
    session = models.ForeignKey(ProcedureSession, related_name='steps', on_delete=models.CASCADE)
    node = models.ForeignKey(Node, on_delete=models.RESTRICT)
    entered_at = models.DateTimeField(auto_now_add=True)
    exited_at = models.DateTimeField(null=True, blank=True)
    
    selected_edge = models.ForeignKey(Edge, null=True, blank=True, on_delete=models.SET_NULL)
    captured_input = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Step {self.id} for node {self.node.frontend_id}"

# --- 5. CUSTOM RBAC (Role-Based Access Control) ---

class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    # Permissions as simple flags for senior-level control
    can_create_flows = models.BooleanField(default=False)
    can_edit_flows = models.BooleanField(default=False)
    can_delete_flows = models.BooleanField(default=False)
    can_manage_users = models.BooleanField(default=False)
    can_execute_flows = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role.name if self.role else 'No Role'}"
