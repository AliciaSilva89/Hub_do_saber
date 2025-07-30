package br.com.hubdosaber.Hub_do_Saber.city.repository;


import br.com.hubdosaber.Hub_do_Saber.city.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {
}