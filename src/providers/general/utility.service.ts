
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UtilityService {


    public calculateSubscriptionPlanPriceWithTax(grossAmount, taxPercentage): any {
        console.log("this is tax function");

        let amountWithTax = parseInt(grossAmount);
        let tax = parseInt(taxPercentage);
        if (tax > 0) {
            let taxAmount = amountWithTax * (tax / 100);
            amountWithTax = amountWithTax + taxAmount;
        }
        return amountWithTax;
    }

    public calculateSubscriptionPlanWithDiscount(taxAmount, discountPercentage): any {
        let amountAfterDiscount = parseInt(taxAmount);
        let discount = parseInt(discountPercentage);
        if (discount > 0) {
            let discountedAmount = amountAfterDiscount * (discount / 100);
            amountAfterDiscount = amountAfterDiscount - discountedAmount;
        }
        return amountAfterDiscount;
    }

    //check Plan Subscription
    public checkSubscription(user): any {
        if (user.entityType == "brand") {
            console.log('brand-----------------------')

            //checking this user is self registered come directly not from any digital agency
            if (user.subscriptionRequired == true) {

                if (user.subscription.type == "licensed") {

                    if (user.subscription.paymentStatus == "paid") {
                        return "already_paid";
                    }

                    else if (user.subscription.paymentStatus == "expired") {
                        return "expired_paid";
                    }

                    else if (user.subscription.paymentStatus == "not_paid") {
                        return "show_payment_message";
                    } else {
                        return false;
                    }

                }
                else if (user.subscription.type == "trial") {

                    if (user.subscription.paymentStatus == "expired") {
                        return "expired_paid_message";
                    }
                    else if (user.subscription.paymentStatus == "not_required") {
                        return "show_trial_message";
                    } else {
                        return false;
                    }

                } else {
                    return false;
                }

            } else {
                return "associated_brand_user";

            }

        }
        console.log('user--------', user);


    }

    public checkUserPermission(user, permissionName): any {

        console.log('permission name ', permissionName);
        let permission: boolean = false;
        console.log('permission check', user);
        user.permissions.forEach(element => {
            //check permission exist
            if (element.codeName == permissionName) {
                permission = true;
            }
        });
        return permission;
    }

    public checkPlanFeatures(user, featureName): any {
        console.log('feature name ', featureName);
        //index for matching features with permission when getting
        let feature: number = -1;
        console.log('feature check', user);

        if (user.subscription.plan.features.length > 0) {

            user.subscription.plan.features.forEach((element, index) => {
                //check permission exist
                if (element.codeName == featureName) {
                    feature = index;
                }
            });

        }

        return feature;

    }


    public checkUserOldSubscription(user, featureName, permissionName): any {
        if (user.entityType == "brand") {
            console.log('brand-----------------------')

            if (user.userRole == "guest_brand") {

                //checking this user is self registered come directly not from any digital agency
                if (user.subscriptionRequired == true) {

                    if (user.subscription.paymentStatus == "paid" || user.subscription.paymentStatus == "not_required") {

                        if (this.checkPlanFeatures(user, featureName) > -1) {

                            if (this.checkUserPermission(user, permissionName) == true) {
                                return "proceed";
                            } else {
                                return "permission_denied";
                            }

                        } else {
                            return "feature_not_avaialble";
                        }

                    }

                    else if (user.subscription.paymentStatus == "expired") {
                        return "expired_paid";
                    }

                    else if (user.subscription.paymentStatus == "not_paid") {
                        return "show_payment_message";
                    } else {
                        return false;
                    }

                } else {
                    return "contact_administrator";

                }
            }
            else {
                //checking this user is self registered come directly not from any digital agency
                if (user.subscriptionRequired == true) {

                    if (user.subscription.type == "licensed") {

                        if (user.subscription.paymentStatus == "paid") {

                            if (this.checkPlanFeatures(user, featureName) > -1) {

                                if (this.checkUserPermission(user, permissionName) == true) {
                                    return "proceed";
                                } else {
                                    return "permission_denied";
                                }

                            } else {
                                return "feature_not_avaialble";
                            }

                        }

                        else if (user.subscription.paymentStatus == "expired") {
                            return "expired_paid";
                        }

                        else if (user.subscription.paymentStatus == "not_paid") {
                            return "show_payment_message";
                        } else {
                            return "status_not_found";
                        }

                    }
                    else if (user.subscription.type == "trial") {

                        if (user.subscription.paymentStatus == "expired") {
                            return "expired_paid_message";
                        }
                        else if (user.subscription.paymentStatus == "not_required") {

                            if (this.checkPlanFeatures(user, featureName) > -1) {

                                if (this.checkUserPermission(user, permissionName) == true) {
                                    return "proceed";
                                } else {
                                    return "permission_denied";
                                }

                            } else {
                                return "feature_not_avaialble";
                            }

                        } else {
                            return false;
                        }

                    } else {
                        return false;
                    }

                } else {

                    if (this.checkUserPermission(user, permissionName) == true) {
                        return "proceed";
                    } else {
                        return "permission_denied";
                    }
                    //return "associated_brand_user";

                }


            }


        }
        console.log('user--------', user);


    }




    public checkUserSubscription(user, featureName, permissionName): any {
        if (user.entityType == "brand") {
            console.log('brand-----------------------')

            //checking this user is self registered come directly not from any digital agency
            if (user.subscriptionRequired == true) {

                if (this.checkUserPermission(user, permissionName) == true) {

                    if (user.subscription.type == "licensed") {

                        if (user.subscription.paymentStatus == "paid") {

                            if (this.checkPlanFeatures(user, featureName) > -1) {
                                return "proceed";
                            } else {
                                return "feature_not_avaialble";
                            }
                        }
                        else if (user.subscription.paymentStatus == "expired") {
                            return "expired_paid_message";
                        }
                        else if (user.subscription.paymentStatus == "not_paid") {
                            return "show_payment_message";
                        } else {
                            return "status_not_found";
                        }
                    }
                    else if (user.subscription.type == "trial") {

                        if (user.subscription.paymentStatus == "expired") {
                            return "expired_paid_message";
                        }
                        else if (user.subscription.paymentStatus == "not_required") {

                            if (this.checkPlanFeatures(user, featureName) > -1) {
                                return "proceed";
                            } else {
                                return "feature_not_avaialble";
                            }

                        } else {
                            return false;
                        }

                    } else {
                        return false;
                    }
                } else {
                    return "permission_denied";
                }
            }
            else if (user.subscriptionRequired == false && user.userRole != "guest_brand") {

                if (this.checkUserPermission(user, permissionName) == true) {
                    return "proceed";
                } else {
                    return "permission_denied";
                }
                //return "associated_brand_user";

            }
            else if (user.subscriptionRequired == false && user.userRole == "guest_brand") {
                return "contact_administrator";
            }





        } else {
            return false;
        }
        // console.log('user--------', user);


    }




    public checkUserOldCountSubscription(user, featureName, permissionName): any {
        if (user.entityType == "brand") {
            console.log('brand-----------------------')

            if (user.userRole == "guest_brand") {

                //checking this user is self registered come directly not from any digital agency
                if (user.subscriptionRequired == true) {

                    if (user.subscription.paymentStatus == "paid" || user.subscription.paymentStatus == "not_required") {

                        let index = this.checkPlanFeatures(user, featureName);
                        if (index > -1) {

                            if (user.subscription.plan.features[index].availableValue > 0) {

                                if (user.subscription.plan.features[index].monthWiseAvailableValue > 0) {
                                    if (this.checkUserPermission(user, permissionName) == true) {
                                        return "proceed";
                                    } else {
                                        return "permission_denied";
                                    }
                                }
                                else {
                                    return "monthly_limit_over";
                                }
                            }
                            else {
                                return "yearly_limit_over";
                            }



                        } else {
                            return "feature_not_avaialble";
                        }

                    }

                    else if (user.subscription.paymentStatus == "expired") {
                        return "expired_paid";
                    }

                    else if (user.subscription.paymentStatus == "not_paid") {
                        return "show_payment_message";
                    } else {
                        return false;
                    }

                } else {
                    return "contact_administrator";

                }
            }
            else {
                //checking this user is self registered come directly not from any digital agency
                if (user.subscriptionRequired == true) {

                    // if (user.subscription.type == "licensed") {

                    if (user.subscription.paymentStatus == "paid" || user.subscription.paymentStatus == "not_required") {

                        let index = this.checkPlanFeatures(user, featureName);
                        if (index > -1) {

                            if (user.subscription.plan.features[index].availableValue > 0) {

                                if (user.subscription.plan.features[index].monthWiseAvailableValue > 0) {
                                    if (this.checkUserPermission(user, permissionName) == true) {
                                        return "proceed";
                                    } else {
                                        return "permission_denied";
                                    }
                                }
                                else {
                                    return "monthly_limit_over";
                                }
                            }
                            else {
                                return "yearly_limit_over";
                            }



                        } else {
                            return "feature_not_avaialble";
                        }

                    }

                    else if (user.subscription.paymentStatus == "expired") {
                        return "expired_paid";
                    }

                    else if (user.subscription.paymentStatus == "not_paid") {
                        return "show_payment_message";
                    } else {
                        return "status_not_found";
                    }

                    // }
                    // else if (user.subscription.type == "trial") {

                    //     if (user.subscription.paymentStatus == "expired") {
                    //         return "expired_paid_message";
                    //     }
                    //     else if (user.subscription.paymentStatus == "not_required") {

                    //         if (this.checkPlanFeatures(user, featureName) > -1) {

                    //             if (this.checkUserPermission(user, permissionName) == true) {
                    //                 return "proceed";
                    //             } else {
                    //                 return "permission_denied";
                    //             }

                    //         } else {
                    //             return "feature_not_avaialble";
                    //         }

                    //     } else {
                    //         return false;
                    //     }

                    // } else {
                    //     return false;
                    // }

                } else {
                    if (this.checkUserPermission(user, permissionName) == true) {
                        return "proceed";
                    } else {
                        return "permission_denied";
                    }
                    // return "associated_brand_user";  

                }


            }
        }
        console.log('user--------', user);


    }


    public checkUserCountSubscription(user, featureName, permissionName): any {
        if (user.entityType == "brand") {
            console.log('brand-----------------------')
            //checking this user is self registered come directly not from any digital agency
            if (user.subscriptionRequired == true) {

                if (this.checkUserPermission(user, permissionName) == true) {


                    if (user.subscription.type == "licensed") {

                        if (user.subscription.paymentStatus == "paid") {

                            let index = this.checkPlanFeatures(user, featureName);
                            if (index > -1) {

                                if (user.subscription.plan.duration <= 30) {

                                    if (user.subscription.plan.features[index].availableValue > 0) {

                                        if (user.subscription.plan.features[index].monthWiseAvailableValue > 0) {
                                            return "proceed";
                                        }
                                        else {
                                            return "monthly_limit_over";
                                        }
                                    }
                                    else {
                                        return "over_all_limit_over";
                                    }
                                }
                                else {

                                    if (user.subscription.plan.features[index].availableValue > 0) {

                                        if (user.subscription.plan.features[index].monthWiseAvailableValue > 0) {
                                            return "proceed";
                                        }
                                        else {
                                            return "monthly_limit_over";
                                        }
                                    }
                                    else {
                                        return "over_all_limit_over";
                                    }

                                }
                            } else {
                                return "feature_not_avaialble";
                            }

                        }

                        else if (user.subscription.paymentStatus == "expired") {
                            return "expired_paid_message";
                        }

                        else if (user.subscription.paymentStatus == "not_paid") {
                            return "show_payment_message";
                        }

                        else {
                            return "status_not_found";
                        }

                    }
                    else if (user.subscription.type == "trial") {

                        if (user.subscription.paymentStatus == "not_required") {

                            let index = this.checkPlanFeatures(user, featureName);
                            if (index > -1) {

                                if (user.subscription.plan.duration <= 30) {

                                    if (user.subscription.plan.features[index].availableValue > 0) {

                                        if (user.subscription.plan.features[index].monthWiseAvailableValue > 0) {
                                            return "proceed";
                                        }
                                        else {
                                            return "monthly_limit_over";
                                        }
                                    }
                                    else {
                                        return "over_all_limit_over";
                                    }
                                }
                                else {

                                    if (user.subscription.plan.features[index].availableValue > 0) {

                                        if (user.subscription.plan.features[index].monthWiseAvailableValue > 0) {
                                            return "proceed";
                                        }
                                        else {
                                            return "monthly_limit_over";
                                        }
                                    }
                                    else {
                                        return "over_all_limit_over";
                                    }

                                }
                            } else {
                                return "feature_not_avaialble";
                            }

                        }

                        else if (user.subscription.paymentStatus == "expired") {
                            return "expired_paid_message";
                        }

                        else {
                            return "status_not_found";
                        }

                    }
                    else {
                        return false;
                    }

                } else {
                    return "permission_denied";
                }
            }
            else if (user.subscriptionRequired == false && user.userRole != "guest_brand") {

                if (this.checkUserPermission(user, permissionName) == true) {
                    return "proceed";
                } else {
                    return "permission_denied";
                }
                //return "associated_brand_user";

            }
            else if (user.subscriptionRequired == false && user.userRole == "guest_brand") {
                return "contact_administrator";
            }
        } else {
            return "associated_brand_user";
        }
        // console.log('user--------', user);


    }


}

