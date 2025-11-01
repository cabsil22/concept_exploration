# Overview

Small demonstration of using Django as a backend with DRF for the Javascript GIS front end project at [GIS Project](https://github.com/cabsil22/concept_exploration/tree/main/2%20-%20GIS)

For a quick overview of the project check out the video here: 

[Software Demo Video](https://youtu.be/nvlPaqZo4U4)

# Web Pages

The main focus of this project is to be the backend for the GIS Map, so the majority of the application is built on the map interface. 

# Development Environment

I'm using Django version 5 and vanilla javascript for this project. 

The backend of the project is built in python while the front end is vanilla Javascript. 

To set the environment up, set up a python virtual environment with venv and then pull in the requirements.txt. Migrate the database via the manage.py for Django. 

Be sure to set an environment variable for the maps api key, the application is expecting that to be MAPS_API_KEY. 

You can get an API key by going to google's developer console and requesting a maps key that works with the Javascript Maps api.  They are free for a small amount of use. 

# Useful Websites

Some resources I used along the way to create this project are listed here. 

* [Web Site Name](https://www.django-rest-framework.org/)
* [Web Site Name](https://www.django-rest-framework.org/tutorial/quickstart/)
* [Web Site Name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
* [Web Site Name](https://www.geeksforgeeks.org/python/overriding-the-save-method-django-models/)
* [Web Site Name](https://docs.djangoproject.com/en/5.2/topics/class-based-views/)
* [Web Site Name](https://docs.djangoproject.com/en/5.2/topics/http/urls/)

# Future Work


* Clean up the UI
* Break the javascript out into cleaner modules
* Streamline the process of creating fields and shapes. 