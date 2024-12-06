package com.acs560.dons_pay_backend.repository;

import com.acs560.dons_pay_backend.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
	Optional<Merchant> findByMerchantNumber(String merchantNumber);
}
