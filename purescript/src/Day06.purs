module Day06 where

import Prelude
import Data.Array (foldl, intersect, length, nub)
import Data.Enum (enumFromTo)
import Data.Foldable (sum)
import Data.String (Pattern(..), Replacement(..), replaceAll, split)
import Data.String.CodeUnits (singleton)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)

parseInput1 :: String -> Array (Array String)
parseInput1 input =
  input
    # split (Pattern "\n\n")
    # map
        ( \groupAnswers ->
            groupAnswers
              # replaceAll (Pattern "\n") (Replacement "")
              # replaceAll (Pattern " ") (Replacement "")
              # split (Pattern "")
              # nub
        )

parseInput2 :: String -> Array (Array String)
parseInput2 input =
  input
    # split (Pattern "\n\n")
    # map
        ( \groupAnswers ->
            groupAnswers
              # split (Pattern "\n")
              # map (split (Pattern ""))
              # foldl intersect (singleton <$> enumFromTo 'a' 'z')
        )

part1 :: String -> Int
part1 input =
  input
    # parseInput1
    # map length
    # sum

part2 :: String -> Int
part2 input =
  input
    # parseInput2
    # map length
    # sum

main :: Effect Unit
main =
  launchAff_ do
    example <- readTextFile UTF8 "./input/day06.example"
    real <- readTextFile UTF8 "./input/day06.real"
    log $ "part1 example: " <> (show $ part1 example)
    log $ "part1 real: " <> (show $ part1 real)
    log $ "part2 example: " <> (show $ part2 example)
    log $ "part2 real: " <> (show $ part2 real)
