// imports
importScripts('assets/js/sw-utils.js')

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'assets/img/apple-touch-icon.png',
    'css/style.css',
    'assets/vendor/bootstrap/css/bootstrap.min.css',
    'assets/vendor/bootstrap-icons/bootstrap-icons.css',
    'assets/vendor/boxicons/css/boxicons.min.css',
    'assets/vendor/quill/quill.snow.css',
    'assets/vendor/quill/quill.bubble.css',
    'assets/vendor/remixicon/remixicon.css',
    'assets/css/style.css',
    'assets/js/main.js',
    
    'js/sw-utils.js'
] 


const APP_SHELL_INMUTABLE = [
    'https://fonts.gstatic.com',
    'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i',
    'assets/vendor/apexcharts/apexcharts.min.js',
    'assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
    'assets/vendor/chart.js/chart.umd.js',
    'assets/vendor/echarts/echarts.min.js',
    'assets/vendor/quill/quill.min.js'
]

self.addEventListener('install', e =>{

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE))


    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));

})


self.addEventListener('activate', e =>{

    const respuesta  = caches.keys().then(keys =>{

        keys.foreach(key =>{
            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        } )

    })

    e.waitUntil(respuesta);

})



self.addEventListener('fetch', e =>{
  const respuesta  =   caches.match(e.request).then(res =>{
    if(res){
        return res;
    }else{
        return fetch(e.request).then(newRes =>{
            return actulizaCacheDinamico(DYNAMIC_CACHE, e.request,newRes);
        });
    }

    })
    e.respondWith(respuesta)

})