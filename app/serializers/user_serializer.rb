class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :email, :errors
end
