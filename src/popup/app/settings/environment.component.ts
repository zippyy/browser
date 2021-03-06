import * as angular from 'angular';
import * as template from './environment.component.html';

import { EnvironmentService } from 'jslib/abstractions/environment.service';

import { PopupUtilsService } from '../services/popupUtils.service';

export class EnvironmentController {
    iconsUrl: string;
    identityUrl: string;
    apiUrl: string;
    webVaultUrl: string;
    baseUrl: string;
    i18n: any;

    constructor(private i18nService: any, private $analytics: any, private environmentService: EnvironmentService,
        private toastr: any, private $timeout: ng.ITimeoutService) {
        this.i18n = i18nService;

        $timeout(() => {
            PopupUtilsService.initListSectionItemListeners(document, angular);
        }, 500);

        this.baseUrl = environmentService.baseUrl || '';
        this.webVaultUrl = environmentService.webVaultUrl || '';
        this.apiUrl = environmentService.apiUrl || '';
        this.identityUrl = environmentService.identityUrl || '';
        this.iconsUrl = environmentService.iconsUrl || '';
    }

    save() {
        this.environmentService.setUrls({
            base: this.baseUrl,
            api: this.apiUrl,
            identity: this.identityUrl,
            webVault: this.webVaultUrl,
            icons: this.iconsUrl,
        }).then((resUrls: any) => {
            this.$timeout(() => {
                // re-set urls since service can change them, ex: prefixing https://
                this.baseUrl = resUrls.base;
                this.apiUrl = resUrls.api;
                this.identityUrl = resUrls.identity;
                this.webVaultUrl = resUrls.webVault;
                this.iconsUrl = resUrls.icons;

                this.$analytics.eventTrack('Set Environment URLs');
                this.toastr.success(this.i18nService.environmentSaved);
            });
        });
    }
}

EnvironmentController.$inject = ['i18nService', '$analytics', 'environmentService', 'toastr', '$timeout'];

export const EnvironmentComponent = {
    bindings: {},
    controller: EnvironmentController,
    template: template,
};
