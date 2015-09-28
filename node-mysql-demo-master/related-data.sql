-- Joins
-- One of the problems is that if I need 10 accounts, LIMIT will be troublesome
SELECT * FROM Account JOIN AddressBook ON Account.id = AddressBook.accountId;

-- Billion queries way
SELECT * FROM Account LIMIT 10;
-- Then for each account, run the following query
SELECT * FROM AddressBook WHERE accountId = <REPLACE THIS WITH CURRENT Account.id>;
-- This will result in 11 queries, not super efficient but at least we get 10 account and only 10 accounts

-- "Best of both worlds"?
SELECT * FROM Account LIMIT 10;
-- Gather up all the Account.id and do one more query
SELECT * FROM AddressBook WHERE accountId IN (1,2,3,4,5); -- Whatever IDs were extracted