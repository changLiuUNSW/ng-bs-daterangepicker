/**
 * @license ng-bs-daterangepicker v0.0.2
 * (c) 2013 Chang Liu https://github.com/changLiuUNSW/ng-bs-daterangepicker.git
 * License: MIT
 */
(function (angular) {
'use strict';

angular.module('ngBootstrap', []).directive('input', function ($compile, $parse) {
	return {
		restrict: 'E',
		require: '?ngModel',
		link: function ($scope, $element, $attributes, ngModel) {
			if ($attributes.type !== 'daterange' || ngModel === null ) return;

			var options = {};
			options.format = $attributes.format || 'YYYY-MM-DD';
			options.separator = $attributes.separator || ' - ';
			options.minDate = $attributes.minDate && moment($attributes.minDate);
			options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
			options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) { return index === 0 && parseInt(elem, 10) || elem; }) );
			options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
			options.locale = $attributes.locale && $parse($attributes.locale)($scope);
			options.opens = $attributes.opens && $parse($attributes.opens)($scope);

			function format(date) {
				return date.format(options.format);
			}

			function formatted(dates) {
				return [format(dates.startDate), format(dates.endDate)].join(options.separator);
			}

			ngModel.$formatters.unshift(function (modelValue) {
				if (!modelValue) return '';
				return modelValue;
			});

			ngModel.$parsers.unshift(function (viewValue) {
				return viewValue;
			});

			ngModel.$render = function () {
				if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
				$element.val(formatted(ngModel.$viewValue));
			};

			$scope.$watch($attributes.ngModel, function (modelValue) {
				$element.data('daterangepicker').updateView();
				$element.data('daterangepicker').updateCalendars();
				$element.data('daterangepicker').updateInputText();
			});

			    $element.daterangepicker(options);
                $element.on('apply.daterangepicker', function (ev, picker) {
                    $scope.$apply(function () {
                        ngModel.$setViewValue({ startDate: picker.oldStartDate, endDate: picker.oldEndDate });
                        ngModel.$render();
                    });
                });

                $element.on('cancel.daterangepicker', function (ev, picker) {
                    $scope.$apply(function () {
                        ngModel.$setViewValue(null);
                    });
                    $element.val('');
                });	
		}
	};
});

})(angular);