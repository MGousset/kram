from django_config import config

config()
import datetime

from main.models import Event
dates = Event.objects.all().order_by('date','debut')
today = datetime.datetime.today().date()

for date in dates:
    if date.date < today:
        date.delete()