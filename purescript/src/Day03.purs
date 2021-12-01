module Day03 where

import Prelude

import Data.Foldable (product)
import Data.Int (toNumber)
import Data.List (List, concat, length, mapMaybe, mapWithIndex)
import Data.List as List
import Data.List.Partial (head)
import Data.Maybe (Maybe(..))
import Data.Set (Set, member)
import Data.Set as Set
import Data.String (Pattern(..), split)
import Data.String as S
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Partial.Unsafe (unsafePartial)

newtype Point
  = Point { row :: Int, col :: Int }

derive instance eqPoint :: Eq Point

derive instance ordPoint :: Ord Point

newtype CyclicSlope
  = CyclicSlope
  { height :: Int
  , width :: Int
  , trees :: Set Point
  }

height :: CyclicSlope -> Int
height (CyclicSlope s) = s.height

hasTree :: CyclicSlope -> Int -> Int -> Boolean
hasTree (CyclicSlope s) row col =
  let
    col' = col `mod` s.width
  in
    member (Point { row, col: col' }) s.trees

parseRow :: Int -> String -> List Point
parseRow row str =
  split (Pattern "") str
    # List.fromFoldable
    # mapWithIndex (\col tile -> if tile == "#" then Just (Point { row, col }) else Nothing)
    # mapMaybe identity

parseInput :: String -> CyclicSlope
parseInput input =
  let
    lines = List.fromFoldable $ split (Pattern "\n") input
  in
    CyclicSlope
      { height: length lines
      , width: unsafePartial $ S.length $ head lines
      , trees: Set.fromFoldable $ concat $ mapWithIndex parseRow lines
      }

countCrashesIntoTrees :: CyclicSlope -> Int -> Int -> Int
countCrashesIntoTrees cyclicSlope dRow dCol = go cyclicSlope 0 0 0
  where
  go :: CyclicSlope -> Int -> Int -> Int -> Int
  go slope row col acc
    | row >= height slope = acc
    | otherwise =
      let
        row' = row + dRow

        col' = col + dCol

        acc' = acc + if hasTree slope row col then 1 else 0
      in
        go slope row' col' acc'

part1 :: String -> Int
part1 input =
  let
    slope = parseInput input
  in
    countCrashesIntoTrees slope 1 3

part2 :: String -> Number
part2 input =
  let
    cyclicSlope = parseInput input
    slopes =
      List.fromFoldable
        [ { right: 1, down: 1 }
        , { right: 3, down: 1 }
        , { right: 5, down: 1 }
        , { right: 7, down: 1 }
        , { right: 1, down: 2 }
        ]
    crashes = slopes <#> \{ right, down } -> countCrashesIntoTrees cyclicSlope down right
  in
     product $ toNumber <$> crashes

main :: Effect Unit
main =
  launchAff_ do
    example <- readTextFile UTF8 "./input/day03.example"
    real <- readTextFile UTF8 "./input/day03.real"
    log $ "part1 example: " <> (show $ part1 example)
    log $ "part1 real: " <> (show $ part1 real)
    log $ "part2 example: " <> (show $ part2 example)
    log $ "part2 real: " <> (show $ part2 real)
