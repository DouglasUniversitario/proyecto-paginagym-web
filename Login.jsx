import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login data:', formData)
    
    navigate('/dashboard')
  }

  return (
    <div className="login-page min-vh-100 d-flex align-items-center bg-dark text-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#1a1a1a' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2" style={{ color: '#ff4d4d' }}>Bienvenido de nuevo</h2>
                  <p className="text-light">Inicia sesión en tu cuenta</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-dark text-light border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-dark text-light border-secondary"
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                        type="checkbox" 
                        label="Recuérdame" 
                        className="text-light"
                    />
                    <Link to="/recuperar-password" className="text-decoration-none small" style={{ color: '#ff4d4d' }}>
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-100 mb-3 border-0"
                    style={{ backgroundColor: '#ff4d4d', color: 'white' }} 
                  >
                    Iniciar Sesión
                  </Button>

                  <div className="text-center">
                    <p className="text-light mb-0">
                      ¿No tienes cuenta?{' '}
                      <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#ff4d4d' }}>
                        Regístrate
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Link to="/" className="text-muted text-decoration-none" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                ← Volver al inicio
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
