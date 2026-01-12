from django.apps import AppConfig


class VpmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vpm'

    def ready(self):
        import vpm.signals