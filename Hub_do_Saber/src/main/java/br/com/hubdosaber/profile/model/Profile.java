package br.com.hubdosaber.profile.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profile")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String picture;

    private String bio;

    public Profile() {
    }

    public Profile(String picture, String bio) {
        this.picture = picture;
        this.bio = bio;
    }

    public Integer getId() {
        return id;
    }

    public String getPicture() {
        return picture;
    }

    public String getBio() {
        return bio;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}