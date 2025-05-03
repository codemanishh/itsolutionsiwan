export default function AboutSection() {
  return (
    <section id="about" className="py-12 bg-neutral-lightest">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-darkest mb-4">About IT SOLUTION Computer Center</h2>
            <p className="text-neutral-dark mb-4">IT SOLUTION Computer Center has been providing quality computer education for over 18 years. Our institute is recognized by the Government of India, ensuring that our certifications are accepted across various sectors.</p>
            <p className="text-neutral-dark mb-4">We pride ourselves on offering comprehensive courses that prepare students for the demands of today's job market. Our experienced faculty and well-equipped labs create an optimal learning environment.</p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-primary">18+</div>
                <div className="text-sm text-neutral-dark">Years of Experience</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-neutral-dark">Students Trained</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-neutral-dark">Placement Rate</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Computer Training Classroom" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
