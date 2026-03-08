from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CampaignViewSet, DepartmentViewSet, ProcedureViewSet, 
    ProcedureVersionViewSet, NodeViewSet, EdgeViewSet, 
    ProcedureSessionViewSet, UserViewSet, RoleViewSet, UserProfileViewSet
)

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'procedures', ProcedureViewSet)
router.register(r'versions', ProcedureVersionViewSet)
router.register(r'nodes', NodeViewSet)
router.register(r'edges', EdgeViewSet)
router.register(r'sessions', ProcedureSessionViewSet)
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'user-profiles', UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
