package br.com.hubdosaber.profile.service;

import br.com.hubdosaber.profile.model.Profile;
import br.com.hubdosaber.profile.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public List<Profile> findAllProfiles() {
        return profileRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Profile> findProfileById(Integer id) {
        return profileRepository.findById(id);
    }

    @Transactional
    public Profile createProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    @Transactional
    public Profile updateProfile(Integer id, Profile profileDetails) {
        return profileRepository.findById(id)
                .map(existingProfile -> {
                    existingProfile.setPicture(profileDetails.getPicture());
                    existingProfile.setBio(profileDetails.getBio());
                    return profileRepository.save(existingProfile);
                })
                .orElseThrow(() -> new RuntimeException("Profile not found with id " + id));
    }

    @Transactional
    public void deleteProfile(Integer id) {
        if (!profileRepository.existsById(id)) {
            throw new RuntimeException("Profile not found with id " + id);
        }
        profileRepository.deleteById(id);
    }
}