module Main where

import Data.Char (digitToInt)
import Data.List (foldl', nub)
import Data.Map.Strict (Map)
import qualified Data.Map.Strict as MS
import Text.Parsec
import Text.Parsec.String (GenParser)
import Prelude

type Color = String

type Rule = (Color, [(Int, Color)])

color = do
  adj <- many alphaNum
  char ' '
  color <- many alphaNum
  return $ adj ++ " " ++ color

bag = do
  n <- digit
  char ' '
  c <- color
  try (string " bags") <|> string " bag"
  return (digitToInt n, c)

noBags = do
  string "no other bags"
  return []

line = do
  c <- color
  string " bags contain "
  bags <- try noBags <|> bag `sepBy` string ", "
  char '.'
  return (c, bags)

rules = endBy line endOfLine

parseInput :: [Char] -> Either ParseError [Rule]
parseInput = parse rules "(unknown)"

immediateContainers :: Map Color [(Int, Color)] -> Color -> [Color]
immediateContainers rules color =
  MS.keys $ MS.filter (elem color . map snd) rules

transitiveContainers :: Map Color [(Int, Color)] -> Color -> [Color]
transitiveContainers rules color =
  case immediateContainers rules color of
    [] -> []
    containers -> nub . (containers ++) $ containers >>= transitiveContainers rules

totalBags :: Map Color [(Int, Color)] -> Color -> Int
totalBags rules color =
  case MS.lookup color rules of
    Nothing -> 0
    Just [] -> 1
    Just innerBags -> foldl' countInnerBags 1 innerBags
      where
        countInnerBags acc (n, innerColor) = acc + n * totalBags rules innerColor

part1 :: String -> Either ParseError Int
part1 input = do
  rules <- parseInput input
  return $ length $ transitiveContainers (MS.fromList rules) "shiny gold"

part2 :: [Char] -> Either ParseError Int
part2 input = do
  rules <- parseInput input
  return $ totalBags (MS.fromList rules) "shiny gold" - 1

main :: IO ()
main = do
  example <- readFile "./input/day07.example"
  real <- readFile "./input/day07.real"
  example2 <- readFile "./input/day07.part2.example"

  putStrLn $ "part1 example: " <> show (part1 example)
  putStrLn $ "part1 real: " <> show (part1 real)
  putStrLn $ "part2 example: " <> show (part2 example)
  putStrLn $ "part2 example2: " <> show (part2 example2)
  putStrLn $ "part2 real: " <> show (part2 real)
