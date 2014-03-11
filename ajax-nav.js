
var AjaxNav = function(){
    var settings;
    
    var Responses = [];
    
    /*
     * Funcion que controla la navegacion por ajax
     * 
     * @param {Object} e evento
     */
    var ajaxNavClickHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        
        var $btn = $(this);
        var href = $btn.attr('href');
              
        // Cargar contenido
        loadAjax(href);       
        
    };
    
    /*
     * Funcion encargada de las peticiones ajax
     * 
     * @param {string} url url para la peticion
     */
    var loadAjax = function(url){
              
        // Agregar a historial del navegador
        history.pushState({href: url}, document.title, url); 
        
        $("#loading").show();
                
        // Enviar peticion
        var xhr = $.get(url);

        xhr.done(function(response){

            Responses[url] = {
                url: url,
                response: response
            };

            renderResponse(response);
        });

        // Controlar fallo de la peticion
        xhr.fail(function(response){
            ajaxErrorHandler(response, $container);
        });
    };
    
    var renderResponse = function(response){
        
        var $container = $(settings.container_selector);
        
        // Actualizar estado de botones
        updateActiveButton();
        
        // Poner contenido en el contenedor
        $container.html(response);
        
    };
    
    /*
     * 
     * 
     */
    var popStateHandler = function(){        
        var state = history.state;     
        
        if(state !== null){

            if(Responses[state.href] !== undefined){
                var response = Responses[state.href].response;
                renderResponse(response);
            }
            else{
                loadAjax(state.href);
            }
        }
    };
    
    /*
     * Funcion que actualiza el estado visual del boton activo
     */
    var updateActiveButton = function(){
        $(".active").removeClass('active');
        $("a[href='"+window.location.pathname+"'], button[href='"+window.location.pathname+"']").parent().addClass('active');
    };
    
    /*
     * Funcion que controla los errores ajax
     * 
     * @param {Object} response
     * @param {Object} $content
     */
    var ajaxErrorHandler = function(response){
        
        var $container = $(settings.container_selector);
        $container.html("Ocurrió un error al obtener este contenido"); 
        $("#loading").hide();
        
        console.log(response);
        throw "Notice Error";
    };
    
    
    return {
        init: function(s) {
            settings = s;
            
            updateActiveButton();            
            
            $("body").on("click", settings.button_selector, ajaxNavClickHandler);
            
            $(window).on('popstate', popStateHandler);
        }
    };    
}();


