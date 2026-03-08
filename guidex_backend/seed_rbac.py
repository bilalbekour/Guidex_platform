import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'guidex_backend.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Role, UserProfile

def seed_rbac():
    # 1. Create Default Roles
    admin_role, _ = Role.objects.get_or_create(
        name="ADMINISTRADOR_SUPREMO",
        defaults={
            "description": "Control total sobre la arquitectura de Guidex y gestión de personal.",
            "can_create_flows": True,
            "can_edit_flows": True,
            "can_delete_flows": True,
            "can_manage_users": True,
            "can_execute_flows": True,
        }
    )
    
    agent_role, _ = Role.objects.get_or_create(
        name="AGENTE_OPERATIVO",
        defaults={
            "description": "Ejecución de flujos y reporte de incidencias operativas.",
            "can_create_flows": False,
            "can_edit_flows": False,
            "can_delete_flows": False,
            "can_manage_users": False,
            "can_execute_flows": True,
        }
    )

    # 2. Link existing Users to Roles via Profiles
    for user in User.objects.all():
        profile, created = UserProfile.objects.get_or_create(user=user)
        if not profile.role:
            profile.role = admin_role if user.is_staff else agent_role
            profile.save()
            print(f"Assigned {profile.role.name} to {user.username}")

if __name__ == "__main__":
    print("Seeding RBAC Matrix...")
    seed_rbac()
    print("RBAC Matrix deployed successfully.")
