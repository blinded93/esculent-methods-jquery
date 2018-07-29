class SessionService
  attr_accessor :identifier, :password, :user, :errors

  def initialize(params)
    @identifier = params[:identifier]
    @password = params[:password]
    @user = nil
    @errors = {}
  end

  def self.create(params)
    self.new(params).tap { |s| s.validate_blank }
  end

  def self.create_and_authenticate(params)
    s = self.create(params)
    s.find_user
    s.authenticate
    s
  end

  def validate_blank
    add_error(:identifier, "can't be blank") if identifier.blank?
    add_error(:password, "can't be blank") if password.blank?
  end

  def valid?
    errors.blank?
  end

  def add_error(field, error)
    self.errors[field] = error
  end

  def find_user
    param = identifier.include?("@") ? "email" : "username"
    self.user = User.send("find_by_#{param}", identifier)
  end

  def authenticate
    if user && user.authenticate(password)
      user
    else
      add_error(:password, "doesn't match user")
    end
  end

  def set_current_user(session)
    session[:user_id] = user.id if valid?
  end

  def result
    valid? ? user : {session:self}
  end
end
