#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # 1. Tells Django where your settings.py file is located
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Vivekanand_Photo_Marketing.settings')

    try:
        # 2. Tries to import Django's command-line execution logic
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # 3. Takes the arguments you type in terminal (like 'runserver') and runs them
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()