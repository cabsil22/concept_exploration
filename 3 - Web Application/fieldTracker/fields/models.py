from django.db import models

# Create your models here.


class Field(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.name


class FieldDivision(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    field = models.ForeignKey(Field, on_delete=models.CASCADE, blank=True, null=True)
    geo_path = models.JSONField(blank=True, null=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        if self.name:
            return self.name
        return f"Field Division: {self.id}"

    # def save(self, *args, **kwargs):
    #     if not self.name:
    #         self.name = f"Field Division: {self.id}"
    #     super().save(*args, **kwargs)
