package br.com.hubdosaber.city.service;


import br.com.hubdosaber.city.model.City;
import br.com.hubdosaber.city.repository.CityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CityService {

    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Transactional(readOnly = true)
    public List<City> findAllCities() {
        return cityRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<City> findCityById(Integer id) {
        return cityRepository.findById(id);
    }
}