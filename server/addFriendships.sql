DELETE FROM friendships WHERE id>0;
INSERT INTO friendships (sender, recipient, confirmed) VALUES (1, 2, true), (204,1, false), (1, 3,false);
