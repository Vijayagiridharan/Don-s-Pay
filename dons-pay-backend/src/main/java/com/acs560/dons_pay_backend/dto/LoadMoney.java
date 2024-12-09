package com.acs560.dons_pay_backend.dto;

import java.math.BigDecimal;

public class LoadMoney {
	
    public String getStudentId() {
		return studentId;
	}
	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	private String studentId;
    private BigDecimal amount;

}
