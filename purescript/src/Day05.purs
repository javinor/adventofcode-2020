module Day05 where

import Prelude
import Data.Array (length, mapMaybe)
import Data.Either (Either(..), hush)
import Data.Foldable (maximum, minimum, sum)
import Data.List (List(..), (:))
import Data.List as List
import Data.Maybe (Maybe, fromMaybe)
import Data.String (Pattern(..), split)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)

type SeatRange
  = { front :: Int
    , back :: Int
    , left :: Int
    , right :: Int
    }

type Seat
  = { row :: Int, col :: Int }

parseInput :: String -> Array String
parseInput input =
  input
    # split (Pattern "\n")

seat :: String -> Either String Seat
seat boardingpass = go directions initialSeatRange
  where
  directions = (List.fromFoldable $ split (Pattern "") boardingpass)

  initialSeatRange = ({ front: 0, back: 127, left: 0, right: 7 })

  go :: List String -> SeatRange -> Either String Seat
  go Nil sr =
    if sr.left /= sr.right || sr.front /= sr.back then
      Left $ "Finished directions but seat still not found! " <> show sr
    else
      Right { row: sr.front, col: sr.left }

  go (d : ds) (sr@{ front, back, left, right }) = case d of
    "F" -> go ds (sr { back = back - (back - front + 1) / 2 })
    "B" -> go ds (sr { front = front + (back - front + 1) / 2 })
    "L" -> go ds (sr { right = right - (right - left + 1) / 2 })
    "R" -> go ds (sr { left = left + (right - left + 1) / 2 })
    _ -> Left $ "Got unknown direction: " <> d <> " (" <> show ds <> ")"

calculateSeatIds :: String -> Array Int
calculateSeatIds input =
  input
    # parseInput
    # map seat
    # mapMaybe hush
    # map \{ row, col } -> 8 * row + col

part1 :: String -> Maybe Int
part1 input = maximum $ calculateSeatIds input

part2 :: String -> Int
part2 input =
  let
    seatIds = calculateSeatIds input
    minId = fromMaybe 0 $ minimum seatIds
    maxId = fromMaybe 0 $ maximum seatIds
    nSeatIds = length seatIds
    gauss = (nSeatIds + 1) * (minId + maxId) / 2
  in
    gauss - sum seatIds

main :: Effect Unit
main =
  launchAff_ do
    example <- readTextFile UTF8 "./input/day05.example"
    real <- readTextFile UTF8 "./input/day05.real"
    log $ "part1 example: " <> (show $ part1 example)
    log $ "part1 real: " <> (show $ part1 real)
    -- log $ "part2 example: " <> (show $ part2 example)
    log $ "part2 real: " <> (show $ part2 real)
