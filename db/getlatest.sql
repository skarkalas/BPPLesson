select * from circleactions where colour = 'blue' and ts = (select max(ts) from circleactions where colour = 'blue') and student = :student
union
select * from circleactions where colour = 'black' and ts = (select max(ts) from circleactions where colour = 'black') and student = :student
union
select * from circleactions where colour = 'yellow' and ts = (select max(ts) from circleactions where colour = 'yellow') and student = :student
union
select * from circleactions where colour = 'green' and ts = (select max(ts) from circleactions where colour = 'green') and student = :student
union
select * from circleactions where colour = 'red' and ts = (select max(ts) from circleactions where colour = 'red') and student = :student
union
select * from circleactions where colour = 'orange' and ts = (select max(ts) from circleactions where colour = 'orange') and student = :student
