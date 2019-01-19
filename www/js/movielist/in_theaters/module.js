!function (t) {
    "use strict";
    angular.module("movielist.in_theaters", ["ngRoute", "movielist.services.http"]).config(["$routeProvider", function (t) {
        t.when("/:category/:page?", {
            templateUrl: "/www/html/view.html",
            controller: "MovieListController"
        })
    }]).controller("MovieListController", ["$scope", "$route", "$routeParams", "HttpService", function (e, o, t, a) {
        e.page = parseInt(t.page || 1);
        var i = 5 * (e.page - 1);
        e.title = "Loading...", e.movies = [], e.loading = !0, e.totalCount = 0, e.totalPage = 0, a.jsonp("http://api.douban.com/v2/movie/" + t.category, {
            start: i,
            count: 20,
            q: t.q
        }, function (t) {
            e.loading = !1, e.title = t.title, e.movies = t.subjects, e.totalCount = t.total, e.totalPage = Math.ceil(t.total / 20), e.$apply()
        }), e.go = function (t) {
            0 < t && t < e.totalPage + 1 && o.updateParams({page: t})
        }
    }])
}();