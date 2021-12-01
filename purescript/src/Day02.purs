module Day02
  ( InputRow(..)
  , isValidPassword1
  , main
  , parseInput
  , parseRow
  ) where

import Prelude

import Data.List (List, filter, fromFoldable, length)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), split)
import Data.String as S
import Data.String.Utils as SU
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console (log)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Partial.Unsafe (unsafePartial)
import Utils (unsafeParseInt10)

newtype InputRow
  = InputRow
    { num1 :: Int
    , num2 :: Int
    , letter :: String
    , str :: String
    }

parseRow :: String -> InputRow
parseRow s =
  unsafePartial
    $ let
        [ s', str ] = split (Pattern ": ") s
        [ s'', letter ] = split (Pattern " ") s'
        [ num1, num2 ] = unsafeParseInt10 <$> split (Pattern "-") s''
      in
        InputRow { num1, num2, letter, str }

parseInput :: String -> List InputRow
parseInput input =
  fromFoldable
    $ parseRow
    <$> split (Pattern "\n") input

isValidPassword1 :: InputRow -> Boolean
isValidPassword1 (InputRow r) =
  let
    count = S.length $ SU.filter ((==) r.letter) r.str
  in
    count >= r.num1 && count <= r.num2

isValidPassword2 :: InputRow -> Boolean
isValidPassword2 (InputRow {num1, num2, letter, str}) =
  let 
    mc1 = SU.charAt (num1 - 1) str
    mc2 = SU.charAt (num2 - 1) str
  in
    case [mc1, mc2] of
      [Just c1, Just c2] -> c1 /= c2 && (c1 == letter || c2 == letter)
      _ -> false
    

part1 :: String -> Int
part1 input = length $ filter isValidPassword1 $ parseInput input

part2 :: String -> Int
part2 input = length $ filter isValidPassword2 $ parseInput input

main :: Effect Unit
main =
  launchAff_ do
    example <- readTextFile UTF8 "./input/day02.example"
    real <- readTextFile UTF8 "./input/day02.real"
    log $ "part1 example: " <> (show $ part1 example)
    log $ "part1 real: " <> (show $ part1 real)
    log $ "part2 example: " <> (show $ part2 example)
    log $ "part2 real: " <> (show $ part2 real)
