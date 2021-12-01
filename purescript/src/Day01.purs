module Day01 where

import Prelude

import Control.Alternative (guard)
import Data.List (List, fromFoldable, head)
import Data.Maybe (maybe)
import Data.String (Pattern(..), split)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Utils (unsafeParseInt10)

data T3 a b c = T3 a b c

parseInput :: String -> List Int
parseInput input =
  fromFoldable
    $ unsafeParseInt10
    <$> split (Pattern "\n") input

part1 :: String -> Int
part1 input = 
  let 
    xs = parseInput input
    pairs = do
      x <- xs
      x' <- xs
      guard $ x + x' == 2020
      pure $ Tuple x x'
    h = head pairs
  in maybe (-1) (\(Tuple x x') -> x * x') h

part2 :: String -> Int
part2 input = 
  let 
    xs = parseInput input
    pairs = do
      x <- xs
      y <- xs
      z <- xs
      guard $ x + y + z == 2020
      pure $ T3 x y z
    h = head pairs
  in maybe (-1) (\(T3 x y z) -> x * y * z) h

main :: Effect Unit
main =
  launchAff_ do
    example <- readTextFile UTF8 "./input/day01.example"
    real <- readTextFile UTF8 "./input/day01.real"
    
    log $ "part1 example: " <> (show $ part1 example)
    log $ "part1 real: " <> (show $ part1 real)
    log $ "part2 example: " <> (show $ part2 example)
    log $ "part2 real: " <> (show $ part2 real)
