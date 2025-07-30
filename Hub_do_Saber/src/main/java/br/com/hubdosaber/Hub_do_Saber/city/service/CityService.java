package br.com.hubdosaber.Hub_do_Saber.city.service;


import br.com.hubdosaber.Hub_do_Saber.city.model.City;
import br.com.hubdosaber.Hub_do_Saber.city.repository.CityRepository;
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

    @Transactional
    public City createCity(City city) {
        return cityRepository.save(city);
    }

    @Transactional
    public City updateCity(Integer id, City cityDetails) {
        return cityRepository.findById(id)
                .map(existingCity -> {
                    existingCity.setName(cityDetails.getName());
                    existingCity.setState(cityDetails.getState());
                    return cityRepository.save(existingCity);
                })
                .orElseThrow(() -> new RuntimeException("City not found with id " + id));
    }

    @Transactional
    public void deleteCity(Integer id) {
        if (!cityRepository.existsById(id)) {
            throw new RuntimeException("City not found with id " + id);
        }
        cityRepository.deleteById(id);
    }
}