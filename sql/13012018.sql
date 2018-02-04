-- MySQL Script generated by MySQL Workbench
-- Sat Jan 13 17:37:12 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema discord_bot_rpg
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `discord_bot_rpg` ;

-- -----------------------------------------------------
-- Schema discord_bot_rpg
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `discord_bot_rpg` DEFAULT CHARACTER SET utf8 ;
USE `discord_bot_rpg` ;

-- -----------------------------------------------------
-- Table `discord_bot_rpg`.`Stats`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `discord_bot_rpg`.`Stats` ;

CREATE TABLE IF NOT EXISTS `discord_bot_rpg`.`Stats` (
  `idStat` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `frc` INT UNSIGNED NOT NULL,
  `intelligence` INT UNSIGNED NOT NULL,
  `constitution` INT UNSIGNED NOT NULL,
  `defense` INT UNSIGNED NOT NULL,
  `dexterite` INT UNSIGNED NOT NULL,
  `sagesse` INT UNSIGNED NOT NULL,
  `volonte` INT UNSIGNED NOT NULL,
  `perception` INT UNSIGNED NOT NULL,
  `charisme` INT UNSIGNED NOT NULL,
  `luck` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idStat`),
  UNIQUE INDEX `idStats_UNIQUE` (`idStat` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `discord_bot_rpg`.`Characters`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `discord_bot_rpg`.`Characters` ;

CREATE TABLE IF NOT EXISTS `discord_bot_rpg`.`Characters` (
  `idCharacter` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idStat` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idCharacter`, `idStat`),
  UNIQUE INDEX `idCharacter_UNIQUE` (`idCharacter` ASC),
  INDEX `fk_Character_Stats1_idx` (`idStat` ASC),
  UNIQUE INDEX `idStat_UNIQUE` (`idStat` ASC),
  CONSTRAINT `fk_Character_Stats1`
    FOREIGN KEY (`idStat`)
    REFERENCES `discord_bot_rpg`.`Stats` (`idStat`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `discord_bot_rpg`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `discord_bot_rpg`.`Users` ;

CREATE TABLE IF NOT EXISTS `discord_bot_rpg`.`Users` (
  `idUser` VARCHAR(20) NOT NULL,
  `idCharacter` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `idUsers_UNIQUE` (`idUser` ASC),
  INDEX `fk_Users_Character_idx` (`idCharacter` ASC),
  UNIQUE INDEX `idCharacter_UNIQUE` (`idCharacter` ASC),
  CONSTRAINT `fk_Users_Character`
    FOREIGN KEY (`idCharacter`)
    REFERENCES `discord_bot_rpg`.`Characters` (`idCharacter`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
