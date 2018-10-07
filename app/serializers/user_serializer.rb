class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :email, :avatar, :friends, :errors

  has_many :friends
end
