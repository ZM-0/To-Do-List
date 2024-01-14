-- Sets up the "tododata" database to store data for a to-do list

-- Create a sequence to generate the unique task identifiers
CREATE SEQUENCE "TASK_ID_SEQUENCE";

-- Create a table to store data for tasks
CREATE TABLE "TASK" (
	"TASK_ID" BIGINT PRIMARY KEY DEFAULT NEXTVAL('"TASK_ID_SEQUENCE"'),
	"TASK_NAME" TEXT NOT NULL,
	"TASK_DEADLINE" TIMESTAMP WITH TIME ZONE,
	"TASK_DESCRIPTION" TEXT,
	"TASK_COMPLETE" BOOLEAN DEFAULT FALSE
);
