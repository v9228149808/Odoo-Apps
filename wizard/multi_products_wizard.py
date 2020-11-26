# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class MultiProductsWizard(models.TransientModel):
    _name = "multi.products.wizard"
    _description = "Multi Products Wizard"

    product_ids = fields.Many2many('product.product', 'sale_sale_order_line_rel')

    def add_multipal_products(self):
        sale_id = self.env['sale.order'].search([('id', '=', self._context.get('active_id'))])
        lst_order_line = self.env['sale.order.line'].search([('order_id','=',int(sale_id.id))], limit=1, order="sequence desc")
        lst_order_line = lst_order_line.sequence
        for product in self.product_ids:
            self.env['sale.order.line'].create({
                'product_id': product.id,
                'sequence':lst_order_line + 1,
                'product_uom': product.uom_id.id,
                'price_unit': product.lst_price,
                'order_id': sale_id.id,
            })
        return {'type': 'ir.actions.act_window_close'}