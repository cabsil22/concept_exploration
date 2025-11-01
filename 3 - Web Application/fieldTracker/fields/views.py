from django.shortcuts import render
from django.views.generic import TemplateView, ListView, DetailView
from .models import Field, FieldDivision
from rest_framework import viewsets
import os

from .seriallizers import FieldSerializer, FieldDivisionSerializer


class HomePage(TemplateView):
    template_name = 'map.html'

    def get_context_data(self, **kwargs):
        api_key = os.getenv('MAPS_API_KEY', "SET KEY IN ENV VAR: MAPS_API_KEY")
        initial_coordinates = self.request.GET.get('center', None)
        field_id = self.request.GET.get('field_id', None)
        context = {
            'maps_api_key': api_key,
            'fields': Field.objects.all(),

        }
        if initial_coordinates:
            latitude, longitude = initial_coordinates.split(',')
            initial_coordinates = {'lat': float(latitude), 'lng': float(longitude)}
            context['initial_coordinates'] = initial_coordinates
        if field_id:
            context['selected_field'] = int(field_id)

        return context


class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer


class FieldDivisionViewSet(viewsets.ModelViewSet):
    queryset = FieldDivision.objects.all()
    serializer_class = FieldDivisionSerializer

    def get_queryset(self):
        queryset = FieldDivision.objects.all()
        field_id = self.request.query_params.get('field_id', None)
        if field_id:
            queryset = queryset.filter(field_id=field_id)
        return queryset


class FieldListView(ListView):
    queryset = Field.objects.all()
    context_object_name = 'fields'
    paginate_by = 10
    model = Field


class FieldDetailView(DetailView):
    model = Field
    context_object_name = 'field'
