# from django.db import models

# class ContactMessage(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField()
#     phone_number = models.CharField(max_length=20, blank=True)
#     subject = models.CharField(max_length=200)
#     message = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.name} - {self.subject}"

from django.db import models

class ContactMessage(models.Model):

    SUBJECT_CHOICES = [
        ("General", "General Inquiry"),
        ("Vehicle", "Vehicle Inquiry"),
        ("Test_drive", "Test Drive Request"),
        ("Financing", "Financing Question"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20, blank=True)

    subject_type = models.CharField(
        max_length=20,
        choices=SUBJECT_CHOICES
    )

    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.get_subject_type_display()}"


