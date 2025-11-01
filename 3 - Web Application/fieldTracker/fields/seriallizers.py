from .models import Field, FieldDivision
from rest_framework import serializers

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = '__all__'


class FieldDivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldDivision
        fields = '__all__'
