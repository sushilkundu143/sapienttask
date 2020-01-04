var angularapp = angular.module("angularapp", []);

//-------------- navbar directive end here ----------------//
angularapp.controller('homeCtrl', function ($scope, $http, $filter) {
    $scope.responserow = [];
    $scope.items = [];
    $scope.tags = [];
    $scope.filteritems = [];
    $scope.selectedItem = '';
    $scope.filters = [
        {category: 'species', name: 'Human', value: false},
        {category: 'species', name: 'Alien', value: false},
        {category: 'species', name: 'Other', value: false},
        {category: 'gender', name: 'Male', value: false},
        {category: 'gender', name: 'Female', value: false},
        {category: 'gender', name: 'unknown', value: false},
        {category: 'origin', name: 'unknown', value: false},
        {category: 'origin', name: 'Earth', value: false}
    ];
    $scope.$watch('filters', (newvalue, oldvalue) => {
        if(newvalue != oldvalue){
            $scope.list = [];
            // console.log('$scope.filters:', $scope.filters);
            $scope.tags = $scope.filters.filter(x => x.value == true);
            // console.log(' $scope.tags:', $scope.tags);
            $scope.obj = {};
            for(x of $scope.tags){
                if($scope.obj.hasOwnProperty(x.category)){
                    $scope.obj[x.category].push(x.name);                       
                } else {
                    $scope.obj[x.category] = [];
                    $scope.obj[x.category].push(x.name);
                }
            }
             console.log('$scope.obj:', $scope.obj);
            if(Object.entries($scope.obj).length > 0 && $scope.obj.constructor === Object){
                $scope.filteritems = angular.copy($scope.responserow);
                Object.keys($scope.obj).forEach(key => {
                    let value = $scope.obj[key];
                    $scope.filteritems = $scope.filteritems.filter(x =>{
                        if(value.length > 0){
                            for(item of value){
                                console.log('item:', item, x[key], key);
                                if(key != 'origin' && x[key].includes(item)){
                                    return x;
                                } else if(key == 'origin') {
                                    console.log('origin:', x[key].name, item);
                                    if(x[key].name.includes(item)){
                                        return x;
                                    }
                                }
                            }
                        }
                    });
                });
                console.log('$scope.filteritems:', $scope.filteritems);
                $scope.items = $scope.filteritems;
            } else {
                $scope.items = $scope.responserow;
            }
            $scope.items = $scope.selectedItem == 'ascending' ? $scope.items.sort((a, b) => a.id - b.id) : $scope.items = $scope.items.sort((a, b) => b.id - a.id);
        }
    }, true);
    $scope.deletefilter = function(name){
        console.log('tag name:', name);
        $scope.filters = $scope.filters.map(x => {
            if(x.name == name){
                x.value = false;
            }
            return x;
        });
        console.log('$scope.filters:', $scope.filters);
        $scope.tags = $scope.tags.filter(x => x.name != name);
        console.log('$scope.tags:', $scope.tags);
    };
    $scope.update = function(){
        $scope.items = $scope.selectedItem == 'ascending' ? $scope.items.sort((a, b) => a.id - b.id) : $scope.items = $scope.items.sort((a, b) => b.id - a.id);
        console.log('$scope.items:', $scope.items);
    };
    // console.log('tags length:', $scope.tags);
    console.log('loading home controller');
    $http.get("https://rickandmortyapi.com/api/character/")
        .then(function (response) {
            $scope.responserow = response.data.results;
            $scope.items = response.data.results;
            console.log('$scope.items:', $scope.items);
        });

});


