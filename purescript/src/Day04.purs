module Day04 where

import Prelude

import Data.Array (elem, filter, foldr, length)
import Data.Either (hush)
import Data.Int (fromString)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (fromMaybe)
import Data.String (Pattern(..), Replacement(..), replaceAll, split)
import Data.String.CodeUnits (dropRight, takeRight)
import Data.String.Regex (regex, test)
import Data.String.Regex.Flags (noFlags)
import Data.String.Utils (startsWith)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Partial.Unsafe (unsafePartial)

parseEntries :: Array String -> Map String String
parseEntries = foldr parseEntry Map.empty
  where
  parseEntry str acc =
    unsafePartial
      $ let
          [ key, value ] = split (Pattern ":") str
        in
          Map.insert key value acc

parseParagraph :: String -> Array String
parseParagraph str =
  str
    # replaceAll (Pattern "\n") (Replacement " ")
    # split (Pattern " ")

parseInput :: String -> Array (Array String)
parseInput input =
  input
    # split (Pattern "\n\n")
    # map parseParagraph

isValidPassport1 :: Array String -> Boolean
isValidPassport1 entries =
  let
    validEntries = filter (not <<< startsWith "cid") entries
  in
    length validEntries == 7

isValidPassport2 :: Map String String -> Boolean
isValidPassport2 m =
  fromMaybe false do
    byr <- Map.lookup "byr" m
    iyr <- Map.lookup "iyr" m
    eyr <- Map.lookup "eyr" m
    hgt <- Map.lookup "hgt" m
    hcl <- Map.lookup "hcl" m
    ecl <- Map.lookup "ecl" m
    pid <- Map.lookup "pid" m
    
    byr' <- fromString byr
    iyr' <- fromString iyr
    eyr' <- fromString eyr
    
    let
      hgtUnit = takeRight 2 hgt
    hgt' <- fromString $ dropRight 2 hgt
    
    hclRegex <- hush $ regex "#[a-z0-9]{6}" noFlags
    pidRegex <- hush $ regex "^\\d{9}$" noFlags

    pure 
      $ between 1920 2002 byr'
      && between 2010 2020 iyr'
      && between 2020 2030 eyr'
      && case hgtUnit of
          "cm" -> between 150 193 hgt'
          "in" -> between 59 76 hgt'
          _ -> false
      && test hclRegex hcl
      && elem ecl ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]
      && test pidRegex pid

part1 :: String -> Int
part1 input =
  input
    # parseInput
    # filter isValidPassport1
    # length

part2 :: String -> Int
part2 input =
  input
    # parseInput
    # map parseEntries
    # filter isValidPassport2
    # length

main :: Effect Unit
main =
  launchAff_ do
    example <- readTextFile UTF8 "./input/day04.example"
    real <- readTextFile UTF8 "./input/day04.real"
    log $ "part1 example: " <> (show $ part1 example)
    log $ "part1 real: " <> (show $ part1 real)
    log $ "part2 example: " <> (show $ part2 example)
    log $ "part2 real: " <> (show $ part2 real)
