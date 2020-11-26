odoo.define('so_multi_products_add.dom', function (require) {
    "use strict";

    var dom = require('web.dom');
    var core = require('web.core');
    var ListView = require('web.ListView');
    var SearchView = require('web.SearchView');
    var view_dialogs = require('web.view_dialogs');

    var _t = core._t;


    function _notify(content, callbacks) {
        _.each(callbacks, function (c) {
            if (c.widget && c.widget.on_attach_callback) {
                c.widget.on_attach_callback(c.callback_args);
            }
        });
        core.bus.trigger('DOM_updated', content);
    }

    dom.append = function ($target, content, options) {
            $target.append(content);
            if (options && options.in_DOM) {
                _notify(content, options.callbacks);

                if (options.callbacks){
                    for (var i in options.callbacks){
                        if (options.callbacks[i].widget.modelName == "multi.products.wizard")
                        $target.find(".o_field_x2many_list_row_add a").click();
                    }
                }
            }
        };

    view_dialogs.SelectCreateDialog.include({
        setup: function (search_defaults, fields_views) {
            var self = this;
            var fragment = document.createDocumentFragment();

            var searchDef = $.Deferred();

            // Set the dialog's header and its search view
            var $header = $('<div/>').addClass('o_modal_header').appendTo(fragment);
            var $pager = $('<div/>').addClass('o_pager').appendTo($header);
            var options = {
                $buttons: $('<div/>').addClass('o_search_options').appendTo($header),
                search_defaults: search_defaults,
            };
            var searchview = new SearchView(this, this.dataset, fields_views.search, options);
            searchview.prependTo($header).done(function () {
                var d = searchview.build_search_data();
                if (self.initial_ids) {
                    d.domains.push([["id", "in", self.initial_ids]]);
                    self.initial_ids = undefined;
                }
                var searchData = self._process_search_data(d.domains, d.contexts, d.groupbys);
                searchDef.resolve(searchData);
            });

            return $.when(searchDef).then(function (searchResult) {
                // Set the list view
                var listView = new ListView(fields_views.list, _.extend({
                    context: searchResult.context,
                    domain: searchResult.domain,
                    groupBy: searchResult.groupBy,
                    modelName: self.dataset.model,
                    hasSelectors: !self.options.disable_multiple_selection,
                    readonly: true,
                }, self.options.list_view_options));
                listView.setController(view_dialogs.SelectCreateListController);
                return listView.getController(self);
            }).then(function (controller) {
                self.list_controller = controller;
                // Set the dialog's buttons
                self.__buttons = [{
                    text: _t("Cancel"),
                    classes: "btn-secondary o_form_button_cancel",
                    close: true,
                }];
                if (!self.options.no_create) {
                    self.__buttons.unshift({
                        text: _t("Create"),
                        classes: "btn-primary",
                        click: self.create_edit_record.bind(self)
                    });
                }
                if (!self.options.disable_multiple_selection) {
                    self.__buttons.unshift({
                        text: _t("Select"),
                        classes: "btn-primary o_select_button",
                        disabled: true,
                        close: true,
                        click: function () {
                            var records = self.list_controller.getSelectedRecords();
                            var values = _.map(records, function (record) {
                                return {
                                    id: record.res_id,
                                    display_name: record.data.display_name,
                                };
                            });
                            self.on_selected(values);
                            $("button[name='add_multipal_products']").click();
                        },
                    });
                }
                return self.list_controller.appendTo(fragment);
            }).then(function () {
                searchview.toggle_visibility(true);
                self.list_controller.do_show();
                self.list_controller.renderPager($pager);
                return fragment;
            });
        },
    });
});