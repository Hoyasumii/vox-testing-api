- [x] Implementar o Doctor
- [x] Implementar o Doctor Availability
- [x] Adicionar o CacheableRepository
- [x] Colocar o PUB/SUB como handler no RepositoryBase
- [x] Ajeitar o Cache na camada de Serviços
- [x] Implementar o Schedule
- [x] Criar o sistema de mensageria na camada de Serviços
- [ ] Criar as Rotas
- [ ] Criar os Testes E2E

Esse findByDoctorId e o findByPatientId está uma porcaria pq ele não tem nenhum filtro e pode retornar uma quantidade gigante de dados. Se eu quiser incrementar ele futuramente eu vou ajeitar esses pontos. Talvez até migrar para um DDD.