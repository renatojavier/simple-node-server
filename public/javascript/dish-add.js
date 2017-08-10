const path = require('path');

/**
 * @class DishAdd
 * Handle async creation of new dish through form's post
 * Dependencies: jquery, toastr
 */
define(['jquery', 'toastr'], ($, toastr) => {

    class DishAdd{
        init() {
            this.submit();
        }

        formControl(element, action, state){
            const form = $('#form-dish-add');

            element = element || null;
            action = action || 'DEFAULT';
            state = state || 'danger';

            switch (action) {
                case 'normalize-inputs':
                    form.find('.form-control').each((index, element) => {
                        $(element)
                        .removeClass('form-control-danger form-control-warning')
                        .parent('.form-group')
                        .removeClass('has-danger has-warning');
                    });
                break;

                case 'add-state':
                    element.addClass(`form-control-${state}`).parent('.form-group').addClass(`has-${state}`);
                break;

                default:
                    form.find('.form-control').each((index, element) => {
                        $(element).val(null);
                    });
                break;
            }
        }

        submit(){
            const THIS = this;
            const form = $('#form-dish-add');
            const inputs = $('.form-control');
            
            form.on('submit', (e) => {
                var dataset = {};
                var error = 0;
                
                inputs.each((index, element) => {
                    if( $(element).val() === undefined || $(element).val() === ''){
                        THIS.formControl( $(element), 'add-state', 'danger' );
                        error += 1;
                    }
                    var dishPropKey = ($(element).attr('name')).replace(/in-dish-/g, '');
                    dataset[dishPropKey] = $(element).val();
                });
                
                if( error > 0 ){
                    toastr.options.closeButton = true;
                    toastr.error(`Please fill-in all fields: <strong>${error} is missing</strong>`, 'Form not accomplished');
                }else{
                    // UI: normalize validation
                    THIS.formControl(null, 'normalize-inputs');
                    THIS.serverConsolidate(dataset);
                }

                e.stopImmediatePropagation();
                e.preventDefault();
            });

            return this;
        }

        serverConsolidate(dataset){
            const THIS = this;
            
            $.ajax({
                url: '/rest/add',
                type: 'post',
                data: dataset,
                success: function(response) {
                    if( Object.keys(response).length > 0 ){
                        toastr.options.onShown = () => {
                            THIS.formControl(null, null);
                        }
                        toastr.success('Heads up! Success creating your new dish', `Dish <u>${dataset.name}</u> was created`);
                    }else{
                        toastr.warning('Something went wrong. Please try again.', 'Dish not created');
                    }
                },
                error: function(){
                    console.log('Service is not ok');
                    toastr.error('Connection to API is not successful','Server Error');
                }
            });

            return this;
        }
    }

    return DishAdd;
});