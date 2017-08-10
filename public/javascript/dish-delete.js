/**
 * @class DishDelete
 * Handle async update of dish through form's post
 * Dependencies: jquery, toastr
 */
define(['jquery', 'toastr'], ($, toastr) => {

    class DishDelete{
        init() {
            this.action();
        }

        /**
         * onDelete button
         * disable table on toastr onShow
         * `option: no` enable the table
         */
        action(){
            const THIS = this;
            const tblDishes = $('.table-dishes');
            const dishes = tblDishes.find('.dishes');

            dishes.find('#btn-dish-delete').on('click', (e, element) => {
                if( !e.originalEvent ) return;

                let id = $(e.currentTarget).data('target');

                toastr.warning(
                    `Are you sure you want to delete?
                    <div style="margin-top: 20px;">
                        <button data-confirm="false" class="btn btn-sm btn-primary">No, keep it</button>&nbsp;
                        <button data-confirm="true" class="btn btn-sm btn-default">Yes, I'm sure</button>
                    </div>`, 
                    'Delete Dish', 
                    {
                        progressBar: true,
                        timeOut: 10 * 1000,
                        extendedTimeout: 5 * 1000,
                        preventDuplicates: true,
                        onShown: () => {
                            tblDishes.addClass('disable-touch');
                            $('.toast').find('[data-confirm]').on('click', (e) => {
                                THIS.handleConfirmation( !!($(e.currentTarget).data('confirm')), id );
                            });
                        },
                        onHidden: () => {
                            $('.table-dishes').removeClass('disable-touch');
                        }
                    }
                );

                e.stopImmediatePropagation();
                e.preventDefault();
            });

            return this;
        }

        handleConfirmation(bool, id){
            bool = bool || false;
            const THIS = this;

            if( bool ){
                toastr.warning('Please wait while working on your request', 'Dish Delete', {
                    timeOut: 1.5 * 1000,
                    onHidden: () => {
                        toastr.info('Dish has been deleted', null, {
                            timeOut: 2 * 1000,
                            onShown: () => {
                                THIS.serverConsolidate( id );
                            }
                        });
                    }
                });
            }else{
                toastr.info('Hey, nothing has been deleted', 'Dish Delete', {
                    timeOut: 3 * 1000,
                    onShown: () => {
                        $('.table-dishes').removeClass('disable-touch');
                    }
                });
            }
        }

        serverConsolidate( _id ){
            const THIS = this;
            $.ajax({
                url: '/rest/remove',
                type: 'delete',
                data: {
                    _id : _id
                },
                beforeSend: () => {
                    console.info('Sending delete request to ID: ',_id);
                },
                success: function( response ) {
                    console.log( response );
                    
                    if( Object.keys(response).length > 0 ){
                        $('.table-dishes').removeClass('disable-touch');
                        THIS.updateUI(_id);
                    }else{
                        toastr.warning('Something went wrong. Please try again.', 'Dish not updated');
                    }
                },
                error: function(){
                    console.log('Service is not ok');
                    toastr.error('Connection to API is not successful. Please try again','Server Error');
                }
            });

            return this;
        }

        updateUI ( id ){
            const THIS = this;
            const tblDishes = $('.table-dishes');

            $(`#${id}`).remove();

            setTimeout(() => {
                const dishes = tblDishes.find('.dishes');
                dishes.each((index,element) => {
                    $(element).find('td').first().text(index+1);
                });
            }, 250);
            
            return;
        }
    }

    return DishDelete;
});