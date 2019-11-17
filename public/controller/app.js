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
         $scope.salvaProduto = function (produto) {
            //já existe o _id no produto?
            if (produto._id === undefined) { //se não te, é POST
                $http({
                    method: 'post',
                    url: urlBase + '/produtos',
                    data: produto
                }).then(function (response) {
                    $scope.mensagem = {
                        cor: 'success',
                        titulo: 'Produto incluído com sucesso!'
                    }
                    //atualizar o array de produtos
                    getProdutos()
                }, function (error) {
                    $scope.mensagem = {
                        cor: 'danger',
                        titulo: error.data.message
                    }
                })
            } else {
                $http({
                    method: 'put',
                    url: urlBase + '/produtos/' + produto._id,
                    data: produto
                }).then(function (response) {
                    $scope.mensagem = {
                        cor: 'success',
                        titulo: 'Produto alterado com sucesso!'
                    }
                    //atualizar o array de produtos
                    getProdutos()
                }, function (error) {
                    $scope.mensagem = {
                        cor: 'danger',
                        titulo: error.data.message
                    }
                })
            }
        }

        // Apaga o produto
        $scope.confirmaExclusaoProduto = function (produto) {
            //vamos confirmr se o usuario quer apagar mesmo
            if (confirm('Confirma a exclisão do produto ' + produto.nome + ' ?')) {
                $http({
                    method: 'delete',
                    url: urlBase + '/produtos/' + produto._id
                }).then(function (response) {
                    $scope.mensagem = {
                        cor: 'success',
                        titulo: response.data.message
                    }
                    getProdutos() //atualizar a listagem
                }, function (error) {
                    $scope.mensagem = {
                        cor: 'danger',
                        titulo: error.data.message
                    }
                })
            }
        }

        // Carrega todos os produtos
        $scope.carregaProdutos = function () {
            getProdutos();
        };
        function getProdutos() {
            $scope.dados = { produtos: null, produto: null }
            $http({
                method: 'get',
                url: urlBase + '/produtos'
            }).then(function (response) {
                $scope.dados = { produtos: response.data }
            }, function (error) {
                $scope.mensagem = { cor: 'danger', titulo: 'Não foi possível obter os produtos. Verifique o backend!' + error.data.message }
            })
        }
        // Carrega os dados do produto pelo Id para a edição
        $scope.obtemProdutoPeloId = function (idProduto) {
            $http({
                method: 'get',
                url: urlBase + '/produtos/' + idProduto
            }).then(function (response) {
                $scope.dados = { produto: response.data, produtos: $scope.dados.produtos }
            }, function (error) {
                $scope.mensagem = { cor: 'danger', titulo: error.data.message }
            });
        }

        /*========================================================
        * FIM das Funções relacionados aos PRODUTOS
        ========================================================*/   
    });

app.controller('horaController', function ($scope, $interval) {
    var tick = function () {
        $scope.clock = Date.now();
    };
    tick();
    $interval(tick, 1000);
});