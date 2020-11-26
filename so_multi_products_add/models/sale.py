# -*- coding: utf-8 -*-

from odoo import models


class SaleOrder(models.Model):
    _inherit = "sale.order"

    def open_multi_products_wizard(self):
        return {
            'name': ('Add multipal products'),
            'view_type': 'form',
            'view_mode': 'form',
            'type': 'ir.actions.act_window',
            'res_model': 'multi.products.wizard',
            'view_id': self.env.ref('so_multi_products_add.add_multi_products_wizard_form').id,
            'target': 'new',
        }
