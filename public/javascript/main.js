/**
 * Front-end module loader using RequireJS
 */
requirejs.config({
    baseUrl: '/javascript',
    paths:{
        jquery: 'lib/jquery.min',
        toastr: 'lib/toastr.min'
    }
});

/**
 * Bootstrap dependencies
 * --------------------------
 * Load only on specific page
 */
require(['dish-add', 'dish-update', 'dish-delete'], (dishAdd, dishUpdate, dishDelete) => {
    // load dish add
    (new dishAdd).init();
    // load dish update
    (new dishUpdate).init();
    // load dish delete
    (new dishDelete).init();

    window.addEventListener('offline', () => {
        console.log('You have been disconnected...');
    })
});