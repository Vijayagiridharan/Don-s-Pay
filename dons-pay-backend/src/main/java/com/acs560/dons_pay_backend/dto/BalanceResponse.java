package com.acs560.dons_pay_backend.dto;

import java.math.BigDecimal;

public class BalanceResponse {
    private BigDecimal donDollarsBalance;
    private Integer mealSwipesBalance;

    public BalanceResponse(BigDecimal donDollarsBalance, Integer mealSwipesBalance) {
        this.donDollarsBalance = donDollarsBalance;
        this.mealSwipesBalance = mealSwipesBalance;
    }

    public BigDecimal getDonDollarsBalance() {
        return donDollarsBalance;
    }

    public void setDonDollarsBalance(BigDecimal donDollarsBalance) {
        this.donDollarsBalance = donDollarsBalance;
    }

    public Integer getMealSwipesBalance() {
        return mealSwipesBalance;
    }

    public void setMealSwipesBalance(Integer mealSwipesBalance) {
        this.mealSwipesBalance = mealSwipesBalance;
    }
}