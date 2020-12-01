# -*- coding: utf-8 -*-

{
    'name': "SO Multi Products ADD",
    'summary': """
        Allow User to select multiple products in sale order lines
    """,
    'description': """
        Allow User to select multiple products in sale order lines
    """,
    'author': "Vasant Chauhan",
    'website': "gmail: vasant.odoo@gmail.com",
    'category': 'Sales',
    'version': '1.0.0.0.1',
    'price': '30',
    'sequence': 0,
    'depends': ['sale_management'],
    'data': [
        'views/assets.xml',
        'views/sale_view.xml',
        'wizard/multi_products_wizard_view.xml',
    ],
    'images': [
        'static/description/images/logo.png',
    ],
    'demo': [
    ],
    "currency": 'EUR',
    'installable': True,
    'application': False,
    'license': 'OPL-1',
}
