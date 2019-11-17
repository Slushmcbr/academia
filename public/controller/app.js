/*
 * Criamos o nosso modulo
 * Observe que estamos carregando os seguintes modulos externos:
 * ngRoute: controle de rotas
 * ngMask: criação de máscaras de entrada de dados 
 **/
var app = angular.module('estoqueApp', ['ngRoute', 'ngMask'])
    //Define o roteamento de acordo com a URL informada pelo usuario
    //Dependendo da URL irá verificar se o usuario está logado
    .config(['$routeProvider', function ($routeProvider) {
        ''
        //Definindo qual view será aberta em cada rota da aplicação
        $routeProvider
            .when('/menu', {
                templateUrl: 'views/menu.html'
            })
            .when('/produtos', {
                templateUrl: 'views/produtos.html'
            })
            .when('/consultar', {
                templateUrl: 'views/consultar.html'
            })
            .otherwise({
                redirectTo: '/menu'
            });
    }])

app.controller('estoqueController',
    function ($scope, $http, $window, $rootScope) {
        /*
         * 
         * RESTFUL SERVICES
         * 
         **********************************************************/
        var urlBase = 'http://localhost:3000';
        /*********************************************************
         *              
         */    
         //funcao para salvar os produtos
         $scope.salvaCliente = function (cliente) {
            //já existe o _id no produto?
            if (cliente._id === undefined) { //se não te, é POST
                $http({
                    method: 'post',
                    url: urlBase + '/clientes',
                    data: cliente
                }).then(function (response) {
                    $scope.mensagem = {
                        cor: 'success',
                        titulo: 'Cliente incluído com sucesso!'
                    }
                    //atualizar o array de produtos
                    getClientes()
                }, function (error) {
                    $scope.mensagem = {
                        cor: 'danger',
                        titulo: error.data.message
                    }
                })
            } else {
                $http({
                    method: 'put',
                    url: urlBase + '/clientes/' + cliente._id,
                    data: cliente
                }).then(function (response) {
                    $scope.mensagem = {
                        cor: 'success',
                        titulo: 'Cliente alterado com sucesso!'
                    }
                    //atualizar o array de produtos
                    getClientes()
                }, function (error) {
                    $scope.mensagem = {
                        cor: 'danger',
                        titulo: error.data.message
                    }
                })
            }
        }

        // Apaga o produto
        $scope.confirmaExclusaoCliente = function (cliente) {
            //vamos confirmr se o usuario quer apagar mesmo
            if (confirm('Confirma a exclisão do cliente ' + cliente.nome + ' ?')) {
                $http({
                    method: 'delete',
                    url: urlBase + '/clientes/' + cliente._id
                }).then(function (response) {
                    $scope.mensagem = {
                        cor: 'success',
                        titulo: response.data.message
                    }
                    getClientes() //atualizar a listagem
                }, function (error) {
                    $scope.mensagem = {
                        cor: 'danger',
                        titulo: error.data.message
                    }
                })
            }
        }

        // Carrega todos os produtos
        $scope.carregaClientes = function () {
            getClientes();
        };
        function getClientes() {
            $scope.dados = { clientes: null, cliente: null }
            $http({
                method: 'get',
                url: urlBase + '/clientes'
            }).then(function (response) {
                $scope.dados = { clientes: response.data }
            }, function (error) {
                $scope.mensagem = { cor: 'danger', titulo: 'Não foi possível obter os clientes. Verifique o backend!' + error.data.message }
            })
        }
        // Carrega os dados do produto pelo Id para a edição
        $scope.obtemClientePeloId = function (idCliente) {
            $http({
                method: 'get',
                url: urlBase + '/clientes/' + idCliente
            }).then(function (response) {
                $scope.dados = { cliente: response.data, clientes: $scope.dados.clientes }
            }, function (error) {
                $scope.mensagem = { cor: 'danger', titulo: error.data.message }
            });
        }

        /*========================================================
        * FIM das Funções relacionados aos CLIENTES
        ========================================================*/   
    });

app.controller('horaController', function ($scope, $interval) {
    var tick = function () {
        $scope.clock = Date.now();
    };
    tick();
    $interval(tick, 1000);
});